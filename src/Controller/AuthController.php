<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Users;
use App\Repository\UsersRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class AuthController
{
     #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        UsersRepository $usersRepository,
        JWTTokenManagerInterface $jwtManager
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if(empty($data['username']) || empty($data['email']) || empty($data['password'])) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Не все поля заполнены'
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $user = new Users();
            $user->setUsername($data['username']);
            $user->setEmail($data['email']);
            $user->setPassword(password_hash($data['password'], PASSWORD_DEFAULT));
            $usersRepository->save($user, true);

            $token = $jwtManager->createFromPayload($user, ['id' => $user->getId()]);

            return new JsonResponse([
                'success' => true,
                'username' => $data['username'],
                'token' => $token
            ], 200);
        } catch (\Exception $error) {
            file_put_contents('../debug.log', date('H:i:s'). "\n Ошибка: " . print_r($error, true));

            return new JsonResponse([
                'success' => false,
                'message' => $error->getMessage()
            ], 500);
        }
    }

    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        UsersRepository $usersRepository,
        JWTTokenManagerInterface $jwtManager
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['email']) || empty($data['password'])) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Email и пароль обязательны'
            ], 400);
        }

        $user = $usersRepository->findOneBy(['email' => $data['email']]);

        if(!$user){
           return new JsonResponse([
                'success' => false,
                'message' => 'Пользователь не найден'
            ], 401);
        }

        $token = $jwtManager->createFromPayload($user, ['id' => $user->getId()]);

        return new JsonResponse([
            'success' => true,
            'username' => $user->getUsername(),
            'token' => $token
        ], 200);
    }
}

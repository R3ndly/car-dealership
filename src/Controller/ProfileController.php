<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UsersRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Doctrine\ORM\EntityManagerInterface;

class ProfileController
{
    #[Route('/profile', name: 'api_profile', methods: ['GET'])]
    public function getProfile(
        Request $request,
        UsersRepository $usersRepository,
        JWTTokenManagerInterface $jwtManeger
    ): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse([
                'success' => false,
                'message' => 'токен не предоставлен'
            ], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $token = $jwtManeger->parse(substr($authHeader, 7));

            $user = $usersRepository->find($token['id']);

            return new JsonResponse([
                'success' => true,
                'user' => [
                    'username' => $user->getUsername(),
                    'email' => $user->getEmail()
                ]
            ]);
        } catch(\Exception $error) {
            return new JsonResponse([
                'success' => false,
                'message' => $error
            ], Response::HTTP_UNAUTHORIZED);
        }
    }

    #[Route('/profile', name: 'api_updateProfile', methods: ['PATCH'])]
    public function updateProfile(
        Request $request,
        UsersRepository $usersRepository,
        JWTTokenManagerInterface $jwtManeger
    ): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse([
                'success' => false,
                'message' => 'токен не предоставлен'
            ], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $token = $jwtManeger->parse(substr($authHeader, 7));

            $user = $usersRepository->find($token['id']);

            $data = json_decode($request->getContent(), true);

            if(isset($data['username'])) {
                $user->setUsername($data['username']);
            }

            if(isset($data['email']) && $data['email'] !== $user->getEmail()) {
                $user->setEmail($data['email']);
            }

            $usersRepository->save($user, true);

            return new JsonResponse([
                'success' => true,
                'user' => [
                    'username' => $user->getUsername(),
                    'email' => $user->getEmail()
                ]
            ]);
        } catch(\Exception $error) {
            return new JsonResponse([
                'success' => false,
                'message' => $error
            ], Response::HTTP_UNAUTHORIZED);
        }
    }

    #[Route('/profile', name: 'api_deleteProfile', methods: ['DELETE'])]
    public function deleteProfile(
        Request $request,
        UsersRepository $usersRepository,
        EntityManagerInterface $entityManager,
        JWTTokenManagerInterface $jwtManeger
    ): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse([
                'success' => false,
                'message' => 'токен не предоставлен'
            ], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $token = $jwtManeger->parse(substr($authHeader, 7));

            $user = $usersRepository->find($token['id']);

            $entityManager->remove($user);
            $entityManager->flush();

            return new JsonResponse([
                'success' => true
            ], 202);
        } catch(\Exception $error) {
            return new JsonResponse([
                'success' => false,
                'message' => $error
            ], Response::HTTP_UNAUTHORIZED);
        }
    }
}

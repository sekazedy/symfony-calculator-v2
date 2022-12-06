<?php

namespace App\Controller;

use App\Entity\Calculator;
use App\Repository\CalculatorRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CalculatorController extends AbstractController
{
    private CalculatorRepository $repository;

    public function __construct(CalculatorRepository $repository)
    {
        $this->repository = $repository;
    }

    #[Route('/', 'home')]
    public function index(): Response
    {
        return $this->render('base.html.twig');
    }

    #[Route('/calculator', 'calculator')]
    public function calculator(): Response
    {
        $calculationResults = $this->repository->getLastFiveResults();

        return $this->render('calculator/index.html.twig', [
            'results' => $calculationResults,
        ]);
    }

    #[Route('/save-result', 'save-result')]
    public function saveResult(Request $request)
    {
        $result = $request->get('result') ?? null;

        if (!$result) {
            return new Response('No saved result provided', Response::HTTP_BAD_REQUEST);
        }

        $calculationResult = new Calculator();
        $calculationResult->setCalcResult((float)$result);

        $this->repository->save($calculationResult, true);

        return new Response('Result saved');
    }

    #[Route('/get-results', 'get-results')]
    public function getResults()
    {
        $calculationResults = $this->repository->getLastFiveResults();

        $output = [];
        foreach ($calculationResults as $result) {
            $output[] = $result->getCalcResult();
        }

        return $this->json([
            'results' => $output,
        ]);
    }
}
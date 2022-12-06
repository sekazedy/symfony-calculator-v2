<?php

namespace App\Entity;

use App\Repository\CalculatorRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CalculatorRepository::class)]
class Calculator
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?float $calc_result = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCalcResult(): ?float
    {
        return $this->calc_result;
    }

    public function setCalcResult(float $calc_result): self
    {
        $this->calc_result = $calc_result;

        return $this;
    }
}

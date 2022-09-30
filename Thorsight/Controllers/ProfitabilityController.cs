﻿using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Thorsight.Models.Dtos;
using Thorsight.Services;

namespace Thorsight.Controllers;
[Route("Api")]
[ApiController]
public class ProfitabilityController : ControllerBase
{
    private readonly QueryClient QueryClient;

    public ProfitabilityController(QueryClient queryClient)
    {
        QueryClient = queryClient;
    }

    [HttpGet("SystemIncome")]
    public async Task<SystemStatisticsDto[]> GetSystemIncomeAsync([FromQuery][Range(7, 180)] int days,
        CancellationToken cancellationToken)
        => (await QueryClient.GetSystemIncomeAsync(days, cancellationToken))
            .OrderBy(x => x.Timestamp)
            .ToArray();
}

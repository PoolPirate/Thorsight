using Common.Services;
using System.Threading;
using Thorsight.Models.MidgardAPI;
using Thorsight.Models.MidgardAPI.Responses;

namespace Thorsight.Services;

public class MidgardClient : Singleton
{
    [Inject]
    private readonly HttpClient Client;

    public async Task<PoolInfo[]> GetPoolsAsync(CancellationToken cancellationToken)
    {
        try
        {
            return await GetFromMidgardAsync<PoolInfo[]>("pools", cancellationToken)
                ?? throw new Exception("Failed to get Pools from Midgard!");
        }
        catch
        {
            throw new Exception("Failed to get Pools from Midgard!"); ;
        }
    }

    public async Task<PoolInfo?> GetPoolAsync(string asset, CancellationToken cancellationToken)
    {
        try
        {
            return await GetFromMidgardAsync<PoolInfo>($"pool/{asset}", cancellationToken);
        }
        catch
        {
            return null;
        }
    }

    public async Task<PoolDepthPriceSnapshot[]?> GetPoolDepthPriceHistory(string asset, int days,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await GetFromMidgardAsync<PoolDepthPriceHistoryResponse>($"history/depths/{asset}?interval=day&count={days + 1}", cancellationToken);
            return result?.Intervals;
        }
        catch
        {
            return null;
        }
    }

    private async Task<T?> GetFromMidgardAsync<T>(string relativeURL, CancellationToken cancellationToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"https://midgard.ninerealms.com/v2/{relativeURL}");
        request.Headers.Add("x-client-id", "thorsight");

        var response = await Client.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            return default;
        }

        return await response.Content.ReadFromJsonAsync<T>();
    }
}

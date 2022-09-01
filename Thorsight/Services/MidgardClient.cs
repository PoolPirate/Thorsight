using Common.Services;
using Thorsight.Models.MidgardAPI;
using Thorsight.Models.MidgardAPI.Responses;

namespace Thorsight.Services;

public class MidgardClient : Singleton
{
    [Inject]
    private readonly HttpClient Client;

    public async Task<PoolInfo[]> GetPoolsAsync()
        => (await Client.GetFromJsonAsync<PoolInfo[]>("https://midgard.thorchain.info/v2/pools"))
        ?? throw new Exception("Failed parsing result from Midgard!");

    public async Task<PoolInfo?> GetPoolAsync(string asset)
    {
        try
        {
            return await Client.GetFromJsonAsync<PoolInfo>($"https://midgard.thorchain.info/v2/pool/{asset}");
        }
        catch
        {
            return null;
        }
    }

    public async Task<PoolDepthPriceSnapshot[]?> GetPoolDepthPriceHistory(string asset, int days)
    {
        try
        {
            var response = await Client.GetFromJsonAsync<PoolDepthPriceHistoryResponse>($"https://midgard.thorchain.info/v2/history/depths/{asset}?interval=day&count={days}");
            return response?.Intervals;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
}

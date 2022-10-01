namespace Thorsight.Models.Dtos;

public class SystemPerformanceInfoDto
{
    public decimal AverageBlockTime { get; }
    public decimal AverageVolumePerBlock { get; }

    public SystemPerformanceInfoDto(decimal averageBlockTime, decimal averageVolumePerBlock)
    {
        AverageBlockTime = averageBlockTime;
        AverageVolumePerBlock = averageVolumePerBlock;
    }
}

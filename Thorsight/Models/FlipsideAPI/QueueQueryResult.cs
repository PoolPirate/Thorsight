namespace Thorsight.Models.FlipsideAPI;

public class QueueQueryResult
{
    public string Token { get; set; } = null!;
    public bool Cached { get; set; }

    public QueueQueryResult()
    {
    }
}

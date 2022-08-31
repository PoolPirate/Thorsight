namespace Thorsight.Models.FlipsideAPI;

public class QueryResultsResult
{
    public object[][] Results { get; set; } = null!;

    public string[] ColumnLabels { get; set; } = null!;
    public string[] ColumnTypes { get; set; } = null!;

    public string Status { get; set; } = null!;
    public string? Message { get; set; }

    public DateTimeOffset StartedAt { get; set; }
    public DateTimeOffset EndedAt { get; set; }

    public QueryResultsResult()
    {
    }
}

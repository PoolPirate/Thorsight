using Common.Configuration;
using System.ComponentModel.DataAnnotations;

namespace Thorsight.Configuration;

[SectionName("ApiKeys")]
public class ApiKeyOptions : Option
{
    [Required]
    public string FlipsideApiKey { get; set; } = null!;
}

using Common.Configuration;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace Thorsight.Configuration;

[SectionName("Binding")]
public sealed class BindingOptions : Option
{
    [Range(1024, UInt16.MaxValue)]
    public ushort ApplicationPort { get; init; } = 4565;
    public IPAddress BindAddress { get; set; } = IPAddress.Any;
}
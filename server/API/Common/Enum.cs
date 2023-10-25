using System.ComponentModel;

namespace API.Common
{
    public enum ProjectPhase
    {
        None,

        [Description("Giai đoạn mở bán đầu tiên")]
        MoBan,

        [Description("Giai đoạn chuẩn bị hoàn thiện")]
        HoanThien,

        [Description("Giai đoạn bàn giao các hạng mục")]
        BanGiao
    }

    public enum ProjectType
    {
        None,

        [Description("Bất động sản đô thị")]
        DoThi,

        [Description("Bất động sản du lịch")]
        DuLich,

        [Description("Bất động sản công nghiệp")]
        CongNghiep
    }
}

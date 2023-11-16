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

    public enum ItemType
    {
        None,
        User,
        Project,
        Content,
        Event,
        Partner
    }

    public enum ContentType
    {
        None,

        [Description("Bài viết giới thiệu")]
        GioiThieu,

        [Description("Bài viết cập nhật tiến độ")]
        CapNhatTienDo,

        [Description("Bài viết phản hồi")]
        Review
    }

    public enum EventType
    {
        None,

        [Description("Diễn ra định kỳ")]
        DinhKy,

        [Description("Diễn ra hàng nằm")]
        HangNam,

        [Description("Diễn ra một lần duy nhất")]
        DuyNhat
    }
    public enum EventStatus
    {
        None,

        [Description("Đang lên kế hoạch")]
        LenKeHoach,

        [Description("Sắp diễn ra")]
        SapDienRa,

        [Description("Đang diễn ra")]
        DangDienRa,

        [Description("Đã kết thúc")]
        KetThuc
    }

    public enum SubcribeType
    {
        None,
        [Description("Nhận mail cập nhật tiến độ")]
        Update,
        [Description("Nhận mail khi có dự án mới")]
        Create,
        [Description("Nhận mail khi có dự án mới lẫn cập nhật tiến độ")]
        All
    }
}

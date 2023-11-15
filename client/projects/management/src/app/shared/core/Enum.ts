export const ProjectType = [
    { id: 1, name: 'Bất động sản đô thị' },
    { id: 2, name: 'Bất động sản du lịch' },
    { id: 3, name: 'Bất động sản công nghiệp' }
];

export const ProjectPhase = [
    { id: 1, name: 'Giai đoạn mở bán đầu tiên' },
    { id: 2, name: 'Giai đoạn chuẩn bị hoàn thiện' },
    { id: 3, name: 'Giai đoạn bàn giao các hạng mục' }
];
export const ContentType = [
    { id: 1, name: 'Bài viết giới thiệu' },
    { id: 2, name: 'Bài viết cập nhật tiến độ' },
    { id: 3, name: 'Bài viết phản hồi' }
];
export const EventType = [
    { id: 1, name: 'Diễn ra định kỳ' },
    { id: 2, name: 'Diễn ra hàng năm' },
    { id: 3, name: 'Diễn ra một lần duy nhất' }
];
export const EventStatus = [
    { id: 1, name: 'Đang lên kế hoạch' },
    { id: 2, name: 'Sắp diễn ra' },
    { id: 3, name: 'Đang diễn ra' },
    { id: 4, name: 'Đã kết thúc' }
];

export enum ProjectTypeEnum {
    None,
    Urban,
    Tourism,
    Industrial
}

export enum ItemType {
    None,
    User,
    Project,
    Content,
    Event,
    Partner
}
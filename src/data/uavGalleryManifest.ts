import { publicAsset } from '../utils/publicAsset';
import { uavGalleryOverrides } from './uavGalleryOverrides';

export type UavGalleryCategory = 'airspace' | 'platform' | 'field' | 'gear' | 'archive';

export type UavGalleryImage = {
  id: string;
  title: {
    zh: string;
    en: string;
  };
  sourceName: string;
  sizeMB: number;
  category: UavGalleryCategory;
  thumbSrc: string;
  displaySrc: string;
  fullSrc: string;
  width?: number;
  height?: number;
  featured?: boolean;
  sourceTitle?: string;
};

const rawUavGalleryImages = [
    {
        "id":  "uav-img-001",
        "title":  {
                      "zh":  "无人机图库 01",
                      "en":  "UAV gallery 01"
                  },
        "sourceName":  "6e980e620615b74b66a580ad40573668.jpg",
        "sizeMB":  0.11,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-001/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-001/display.webp",
        "fullSrc":  "uav-gallery/uav-img-001/full.webp",
        "width":  1280,
        "height":  2274,
        "featured":  true,
        "sourceTitle":  "6e980e620615b74b66a580ad40573668"
    },
    {
        "id":  "uav-img-002",
        "title":  {
                      "zh":  "无人机图库 02",
                      "en":  "UAV gallery 02"
                  },
        "sourceName":  "DJI_20260425185640_0019_D.JPG",
        "sizeMB":  4.88,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-002/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-002/display.webp",
        "fullSrc":  "uav-gallery/uav-img-002/full.webp",
        "width":  4032,
        "height":  3024,
        "featured":  true,
        "sourceTitle":  "DJI 20260425185640 0019 D"
    },
    {
        "id":  "uav-img-003",
        "title":  {
                      "zh":  "无人机图库 03",
                      "en":  "UAV gallery 03"
                  },
        "sourceName":  "DJI_20260425185654_0022_D.JPG",
        "sizeMB":  4.62,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-003/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-003/display.webp",
        "fullSrc":  "uav-gallery/uav-img-003/full.webp",
        "width":  4032,
        "height":  3024,
        "featured":  true,
        "sourceTitle":  "DJI 20260425185654 0022 D"
    },
    {
        "id":  "uav-img-004",
        "title":  {
                      "zh":  "无人机图库 04",
                      "en":  "UAV gallery 04"
                  },
        "sourceName":  "DJI_20260425185701_0023_D.JPG",
        "sizeMB":  7.65,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-004/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-004/display.webp",
        "fullSrc":  "uav-gallery/uav-img-004/full.webp",
        "width":  6144,
        "height":  4096,
        "featured":  true,
        "sourceTitle":  "DJI 20260425185701 0023 D"
    },
    {
        "id":  "uav-img-005",
        "title":  {
                      "zh":  "无人机图库 05",
                      "en":  "UAV gallery 05"
                  },
        "sourceName":  "DJI_20260425185705_0024_D.JPG",
        "sizeMB":  6.35,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-005/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-005/display.webp",
        "fullSrc":  "uav-gallery/uav-img-005/full.webp",
        "width":  6144,
        "height":  4096,
        "featured":  true,
        "sourceTitle":  "DJI 20260425185705 0024 D"
    },
    {
        "id":  "uav-img-006",
        "title":  {
                      "zh":  "无人机图库 06",
                      "en":  "UAV gallery 06"
                  },
        "sourceName":  "f4dfce18f44218d3b29f8df73e8250_livephoto.JPG",
        "sizeMB":  0.75,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-006/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-006/display.webp",
        "fullSrc":  "uav-gallery/uav-img-006/full.webp",
        "width":  1920,
        "height":  2560,
        "featured":  true,
        "sourceTitle":  "f4dfce18f44218d3b29f8df73e8250 livephoto"
    },
    {
        "id":  "uav-img-007",
        "title":  {
                      "zh":  "无人机图库 07",
                      "en":  "UAV gallery 07"
                  },
        "sourceName":  "IMG_0950.JPG",
        "sizeMB":  0.89,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-007/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-007/display.webp",
        "fullSrc":  "uav-gallery/uav-img-007/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 0950"
    },
    {
        "id":  "uav-img-008",
        "title":  {
                      "zh":  "无人机图库 08",
                      "en":  "UAV gallery 08"
                  },
        "sourceName":  "IMG_1740.JPG",
        "sizeMB":  3.45,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-008/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-008/display.webp",
        "fullSrc":  "uav-gallery/uav-img-008/full.webp",
        "width":  3024,
        "height":  4032,
        "featured":  false,
        "sourceTitle":  "IMG 1740"
    },
    {
        "id":  "uav-img-009",
        "title":  {
                      "zh":  "无人机图库 09",
                      "en":  "UAV gallery 09"
                  },
        "sourceName":  "IMG_1899.JPG",
        "sizeMB":  5.46,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-009/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-009/display.webp",
        "fullSrc":  "uav-gallery/uav-img-009/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 1899"
    },
    {
        "id":  "uav-img-010",
        "title":  {
                      "zh":  "无人机图库 10",
                      "en":  "UAV gallery 10"
                  },
        "sourceName":  "IMG_1901.JPG",
        "sizeMB":  0.61,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-010/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-010/display.webp",
        "fullSrc":  "uav-gallery/uav-img-010/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 1901"
    },
    {
        "id":  "uav-img-011",
        "title":  {
                      "zh":  "无人机图库 11",
                      "en":  "UAV gallery 11"
                  },
        "sourceName":  "IMG_2088.JPG",
        "sizeMB":  0.55,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-011/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-011/display.webp",
        "fullSrc":  "uav-gallery/uav-img-011/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 2088"
    },
    {
        "id":  "uav-img-012",
        "title":  {
                      "zh":  "无人机图库 12",
                      "en":  "UAV gallery 12"
                  },
        "sourceName":  "IMG_2227.JPG",
        "sizeMB":  0.34,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-012/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-012/display.webp",
        "fullSrc":  "uav-gallery/uav-img-012/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 2227"
    },
    {
        "id":  "uav-img-013",
        "title":  {
                      "zh":  "无人机图库 13",
                      "en":  "UAV gallery 13"
                  },
        "sourceName":  "IMG_2377.JPG",
        "sizeMB":  0.41,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-013/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-013/display.webp",
        "fullSrc":  "uav-gallery/uav-img-013/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 2377"
    },
    {
        "id":  "uav-img-014",
        "title":  {
                      "zh":  "无人机图库 14",
                      "en":  "UAV gallery 14"
                  },
        "sourceName":  "IMG_2405.JPG",
        "sizeMB":  6.5,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-014/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-014/display.webp",
        "fullSrc":  "uav-gallery/uav-img-014/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 2405"
    },
    {
        "id":  "uav-img-015",
        "title":  {
                      "zh":  "无人机图库 15",
                      "en":  "UAV gallery 15"
                  },
        "sourceName":  "IMG_2442.JPG",
        "sizeMB":  0.45,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-015/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-015/display.webp",
        "fullSrc":  "uav-gallery/uav-img-015/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 2442"
    },
    {
        "id":  "uav-img-016",
        "title":  {
                      "zh":  "无人机图库 16",
                      "en":  "UAV gallery 16"
                  },
        "sourceName":  "IMG_2576.JPG",
        "sizeMB":  2.47,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-016/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-016/display.webp",
        "fullSrc":  "uav-gallery/uav-img-016/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 2576"
    },
    {
        "id":  "uav-img-017",
        "title":  {
                      "zh":  "无人机图库 17",
                      "en":  "UAV gallery 17"
                  },
        "sourceName":  "IMG_3223.JPG",
        "sizeMB":  3.59,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-017/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-017/display.webp",
        "fullSrc":  "uav-gallery/uav-img-017/full.webp",
        "width":  5712,
        "height":  4284,
        "featured":  false,
        "sourceTitle":  "IMG 3223"
    },
    {
        "id":  "uav-img-018",
        "title":  {
                      "zh":  "无人机图库 18",
                      "en":  "UAV gallery 18"
                  },
        "sourceName":  "IMG_3488.JPG",
        "sizeMB":  5.88,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-018/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-018/display.webp",
        "fullSrc":  "uav-gallery/uav-img-018/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 3488"
    },
    {
        "id":  "uav-img-019",
        "title":  {
                      "zh":  "无人机图库 19",
                      "en":  "UAV gallery 19"
                  },
        "sourceName":  "IMG_3618.JPG",
        "sizeMB":  11.77,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-019/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-019/display.webp",
        "fullSrc":  "uav-gallery/uav-img-019/full.webp",
        "width":  5712,
        "height":  4284,
        "featured":  false,
        "sourceTitle":  "IMG 3618"
    },
    {
        "id":  "uav-img-020",
        "title":  {
                      "zh":  "无人机图库 20",
                      "en":  "UAV gallery 20"
                  },
        "sourceName":  "IMG_3695.JPG",
        "sizeMB":  8.35,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-020/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-020/display.webp",
        "fullSrc":  "uav-gallery/uav-img-020/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 3695"
    },
    {
        "id":  "uav-img-021",
        "title":  {
                      "zh":  "无人机图库 21",
                      "en":  "UAV gallery 21"
                  },
        "sourceName":  "IMG_3711.JPG",
        "sizeMB":  4.94,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-021/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-021/display.webp",
        "fullSrc":  "uav-gallery/uav-img-021/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 3711"
    },
    {
        "id":  "uav-img-022",
        "title":  {
                      "zh":  "无人机图库 22",
                      "en":  "UAV gallery 22"
                  },
        "sourceName":  "IMG_3785.JPG",
        "sizeMB":  0.4,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-022/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-022/display.webp",
        "fullSrc":  "uav-gallery/uav-img-022/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 3785"
    },
    {
        "id":  "uav-img-023",
        "title":  {
                      "zh":  "无人机图库 23",
                      "en":  "UAV gallery 23"
                  },
        "sourceName":  "IMG_3862.JPG",
        "sizeMB":  3.62,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-023/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-023/display.webp",
        "fullSrc":  "uav-gallery/uav-img-023/full.webp",
        "width":  5712,
        "height":  4284,
        "featured":  false,
        "sourceTitle":  "IMG 3862"
    },
    {
        "id":  "uav-img-024",
        "title":  {
                      "zh":  "无人机图库 24",
                      "en":  "UAV gallery 24"
                  },
        "sourceName":  "IMG_3874.JPG",
        "sizeMB":  0.5,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-024/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-024/display.webp",
        "fullSrc":  "uav-gallery/uav-img-024/full.webp",
        "width":  1920,
        "height":  1080,
        "featured":  false,
        "sourceTitle":  "IMG 3874"
    },
    {
        "id":  "uav-img-025",
        "title":  {
                      "zh":  "无人机图库 25",
                      "en":  "UAV gallery 25"
                  },
        "sourceName":  "IMG_3952.JPG",
        "sizeMB":  2.79,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-025/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-025/display.webp",
        "fullSrc":  "uav-gallery/uav-img-025/full.webp",
        "width":  5712,
        "height":  4284,
        "featured":  false,
        "sourceTitle":  "IMG 3952"
    },
    {
        "id":  "uav-img-026",
        "title":  {
                      "zh":  "无人机图库 26",
                      "en":  "UAV gallery 26"
                  },
        "sourceName":  "IMG_4133.JPG",
        "sizeMB":  0.4,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-026/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-026/display.webp",
        "fullSrc":  "uav-gallery/uav-img-026/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 4133"
    },
    {
        "id":  "uav-img-027",
        "title":  {
                      "zh":  "无人机图库 27",
                      "en":  "UAV gallery 27"
                  },
        "sourceName":  "IMG_4223.JPG",
        "sizeMB":  1.48,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-027/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-027/display.webp",
        "fullSrc":  "uav-gallery/uav-img-027/full.webp",
        "width":  2160,
        "height":  2880,
        "featured":  false,
        "sourceTitle":  "IMG 4223"
    },
    {
        "id":  "uav-img-028",
        "title":  {
                      "zh":  "无人机图库 28",
                      "en":  "UAV gallery 28"
                  },
        "sourceName":  "IMG_4318.JPG",
        "sizeMB":  2.42,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-028/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-028/display.webp",
        "fullSrc":  "uav-gallery/uav-img-028/full.webp",
        "width":  3024,
        "height":  4032,
        "featured":  false,
        "sourceTitle":  "IMG 4318"
    },
    {
        "id":  "uav-img-029",
        "title":  {
                      "zh":  "无人机图库 29",
                      "en":  "UAV gallery 29"
                  },
        "sourceName":  "IMG_4360.JPG",
        "sizeMB":  5.39,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-029/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-029/display.webp",
        "fullSrc":  "uav-gallery/uav-img-029/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 4360"
    },
    {
        "id":  "uav-img-030",
        "title":  {
                      "zh":  "无人机图库 30",
                      "en":  "UAV gallery 30"
                  },
        "sourceName":  "IMG_4361.JPG",
        "sizeMB":  2.97,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-030/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-030/display.webp",
        "fullSrc":  "uav-gallery/uav-img-030/full.webp",
        "width":  3024,
        "height":  4032,
        "featured":  false,
        "sourceTitle":  "IMG 4361"
    },
    {
        "id":  "uav-img-031",
        "title":  {
                      "zh":  "无人机图库 31",
                      "en":  "UAV gallery 31"
                  },
        "sourceName":  "IMG_4382.JPG",
        "sizeMB":  1.24,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-031/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-031/display.webp",
        "fullSrc":  "uav-gallery/uav-img-031/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 4382"
    },
    {
        "id":  "uav-img-032",
        "title":  {
                      "zh":  "无人机图库 32",
                      "en":  "UAV gallery 32"
                  },
        "sourceName":  "IMG_4535.JPG",
        "sizeMB":  3.02,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-032/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-032/display.webp",
        "fullSrc":  "uav-gallery/uav-img-032/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 4535"
    },
    {
        "id":  "uav-img-033",
        "title":  {
                      "zh":  "无人机图库 33",
                      "en":  "UAV gallery 33"
                  },
        "sourceName":  "IMG_4536.JPG",
        "sizeMB":  9.08,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-033/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-033/display.webp",
        "fullSrc":  "uav-gallery/uav-img-033/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 4536"
    },
    {
        "id":  "uav-img-034",
        "title":  {
                      "zh":  "无人机图库 34",
                      "en":  "UAV gallery 34"
                  },
        "sourceName":  "IMG_4598.JPG",
        "sizeMB":  0.62,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-034/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-034/display.webp",
        "fullSrc":  "uav-gallery/uav-img-034/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 4598"
    },
    {
        "id":  "uav-img-035",
        "title":  {
                      "zh":  "无人机图库 35",
                      "en":  "UAV gallery 35"
                  },
        "sourceName":  "IMG_4632.JPG",
        "sizeMB":  0.46,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-035/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-035/display.webp",
        "fullSrc":  "uav-gallery/uav-img-035/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 4632"
    },
    {
        "id":  "uav-img-036",
        "title":  {
                      "zh":  "无人机图库 36",
                      "en":  "UAV gallery 36"
                  },
        "sourceName":  "IMG_4633.JPG",
        "sizeMB":  3.08,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-036/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-036/display.webp",
        "fullSrc":  "uav-gallery/uav-img-036/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 4633"
    },
    {
        "id":  "uav-img-037",
        "title":  {
                      "zh":  "无人机图库 37",
                      "en":  "UAV gallery 37"
                  },
        "sourceName":  "IMG_4634.JPG",
        "sizeMB":  3.01,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-037/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-037/display.webp",
        "fullSrc":  "uav-gallery/uav-img-037/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 4634"
    },
    {
        "id":  "uav-img-038",
        "title":  {
                      "zh":  "无人机图库 38",
                      "en":  "UAV gallery 38"
                  },
        "sourceName":  "IMG_4753.JPG",
        "sizeMB":  0.38,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-038/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-038/display.webp",
        "fullSrc":  "uav-gallery/uav-img-038/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 4753"
    },
    {
        "id":  "uav-img-039",
        "title":  {
                      "zh":  "无人机图库 39",
                      "en":  "UAV gallery 39"
                  },
        "sourceName":  "IMG_5512.JPG",
        "sizeMB":  0.56,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-039/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-039/display.webp",
        "fullSrc":  "uav-gallery/uav-img-039/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 5512"
    },
    {
        "id":  "uav-img-040",
        "title":  {
                      "zh":  "无人机图库 40",
                      "en":  "UAV gallery 40"
                  },
        "sourceName":  "IMG_5620.JPG",
        "sizeMB":  6.88,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-040/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-040/display.webp",
        "fullSrc":  "uav-gallery/uav-img-040/full.webp",
        "width":  4284,
        "height":  5712,
        "featured":  false,
        "sourceTitle":  "IMG 5620"
    },
    {
        "id":  "uav-img-041",
        "title":  {
                      "zh":  "无人机图库 41",
                      "en":  "UAV gallery 41"
                  },
        "sourceName":  "IMG_5623.JPG",
        "sizeMB":  0.46,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-041/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-041/display.webp",
        "fullSrc":  "uav-gallery/uav-img-041/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 5623"
    },
    {
        "id":  "uav-img-042",
        "title":  {
                      "zh":  "无人机图库 42",
                      "en":  "UAV gallery 42"
                  },
        "sourceName":  "IMG_5637.JPG",
        "sizeMB":  1.01,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-042/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-042/display.webp",
        "fullSrc":  "uav-gallery/uav-img-042/full.webp",
        "width":  2160,
        "height":  2880,
        "featured":  false,
        "sourceTitle":  "IMG 5637"
    },
    {
        "id":  "uav-img-043",
        "title":  {
                      "zh":  "无人机图库 43",
                      "en":  "UAV gallery 43"
                  },
        "sourceName":  "IMG_5639.JPG",
        "sizeMB":  0.44,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-043/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-043/display.webp",
        "fullSrc":  "uav-gallery/uav-img-043/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 5639"
    },
    {
        "id":  "uav-img-044",
        "title":  {
                      "zh":  "无人机图库 44",
                      "en":  "UAV gallery 44"
                  },
        "sourceName":  "IMG_5666.JPG",
        "sizeMB":  1.75,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-044/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-044/display.webp",
        "fullSrc":  "uav-gallery/uav-img-044/full.webp",
        "width":  3024,
        "height":  4032,
        "featured":  false,
        "sourceTitle":  "IMG 5666"
    },
    {
        "id":  "uav-img-045",
        "title":  {
                      "zh":  "无人机图库 45",
                      "en":  "UAV gallery 45"
                  },
        "sourceName":  "IMG_5667.JPG",
        "sizeMB":  0.49,
        "category":  "archive",
        "thumbSrc":  "uav-gallery/uav-img-045/thumb.webp",
        "displaySrc":  "uav-gallery/uav-img-045/display.webp",
        "fullSrc":  "uav-gallery/uav-img-045/full.webp",
        "width":  1080,
        "height":  1920,
        "featured":  false,
        "sourceTitle":  "IMG 5667"
    }
] as const;

export const uavGalleryImages: UavGalleryImage[] = rawUavGalleryImages.map((item) => {
  const override = uavGalleryOverrides[item.id];

  return {
    ...item,
    ...override,
    title: override?.title ?? item.title,
    category: override?.category ?? item.category,
    featured: override?.featured ?? item.featured,
    thumbSrc: publicAsset(item.thumbSrc),
    displaySrc: publicAsset(item.displaySrc),
    fullSrc: publicAsset(item.fullSrc),
  };
});

export function getUavGalleryImageById(id: string) {
  return uavGalleryImages.find((item) => item.id === id);
}
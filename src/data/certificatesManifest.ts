import { publicAsset } from '../utils/publicAsset';

export type CertificateGalleryItem = {
  id: string;
  title: string;
  sourceName: string;
  cover: string;
  pageCount: number;
  rotation: number;
  pageSize: string;
  sizeKB: number;
  pages: string[];
};

const rawCertificates = [
    {
        "id":  "cert-001",
        "title":  "《科学新生活》通知书-李爱延 姜睿 戴富源 徐秋宁 钟泽婷 姚宇峰",
        "sourceName":  "《科学新生活》通知书-李爱延 姜睿 戴富源 徐秋宁 钟泽婷 姚宇峰.pdf",
        "cover":  "certificates/cert-001/cover.png",
        "pageCount":  1,
        "rotation":  0,
        "pageSize":  "841.9 x 595.3 pts (A4)",
        "sizeKB":  139.8,
        "pages":  [
                      "certificates/cert-001/page-001.png"
                  ]
    },
    {
        "id":  "cert-002",
        "title":  "02-生命哨兵卒中AI预警 金奖",
        "sourceName":  "02-生命哨兵卒中AI预警 金奖.pdf",
        "cover":  "certificates/cert-002/cover.png",
        "pageCount":  1,
        "rotation":  90,
        "pageSize":  "676.8 x 957.6 pts",
        "sizeKB":  279.6,
        "pages":  [
                      "certificates/cert-002/page-001.png"
                  ]
    },
    {
        "id":  "cert-003",
        "title":  "19-AI问诊 优胜奖",
        "sourceName":  "19-AI问诊 优胜奖.pdf",
        "cover":  "certificates/cert-003/cover.png",
        "pageCount":  1,
        "rotation":  90,
        "pageSize":  "676.8 x 957.6 pts",
        "sizeKB":  280.3,
        "pages":  [
                      "certificates/cert-003/page-001.png"
                  ]
    },
    {
        "id":  "cert-004",
        "title":  "20241015181635775",
        "sourceName":  "20241015181635775.pdf",
        "cover":  "certificates/cert-004/cover.png",
        "pageCount":  2,
        "rotation":  90,
        "pageSize":  "842.04 x 1190.52 pts (A3)",
        "sizeKB":  1242.2,
        "pages":  [
                      "certificates/cert-004/page-001.png",
                      "certificates/cert-004/page-002.png"
                  ]
    },
    {
        "id":  "cert-005",
        "title":  "何穆演 何衡演 侯旖琪 姜睿 谭雪盈 何诗琪《东方教育学刊》录用通知书",
        "sourceName":  "何穆演 何衡演 侯旖琪 姜睿 谭雪盈 何诗琪《东方教育学刊》录用通知书.pdf",
        "cover":  "certificates/cert-005/cover.png",
        "pageCount":  1,
        "rotation":  0,
        "pageSize":  "595.3 x 841.9 pts (A4)",
        "sizeKB":  181.2,
        "pages":  [
                      "certificates/cert-005/page-001.png"
                  ]
    },
    {
        "id":  "cert-006",
        "title":  "何穆演 何衡演 姜睿 郭汝芯 李爱延《医学研究》录用通知书",
        "sourceName":  "何穆演 何衡演 姜睿 郭汝芯 李爱延《医学研究》录用通知书.pdf",
        "cover":  "certificates/cert-006/cover.png",
        "pageCount":  1,
        "rotation":  0,
        "pageSize":  "595.3 x 841.9 pts (A4)",
        "sizeKB":  296.7,
        "pages":  [
                      "certificates/cert-006/page-001.png"
                  ]
    },
    {
        "id":  "cert-007",
        "title":  "何穆演 侯旖琪 何衡演 徐凯悦 姜睿 姚宇峰《智慧教育》录用通知书",
        "sourceName":  "何穆演 侯旖琪 何衡演 徐凯悦 姜睿 姚宇峰《智慧教育》录用通知书.pdf",
        "cover":  "certificates/cert-007/cover.png",
        "pageCount":  1,
        "rotation":  0,
        "pageSize":  "595.3 x 841.9 pts (A4)",
        "sizeKB":  322.7,
        "pages":  [
                      "certificates/cert-007/page-001.png"
                  ]
    },
    {
        "id":  "cert-008",
        "title":  "黄梦杰 徐凯悦 姜睿 侯旖琪 何穆演 王晶晶《视听导报》 录用通知",
        "sourceName":  "黄梦杰 徐凯悦 姜睿 侯旖琪 何穆演 王晶晶《视听导报》 录用通知.pdf",
        "cover":  "certificates/cert-008/cover.png",
        "pageCount":  1,
        "rotation":  0,
        "pageSize":  "595.3 x 841.9 pts (A4)",
        "sizeKB":  132.9,
        "pages":  [
                      "certificates/cert-008/page-001.png"
                  ]
    },
    {
        "id":  "cert-009",
        "title":  "神经网络荧光检测系统",
        "sourceName":  "神经网络荧光检测系统.pdf",
        "cover":  "certificates/cert-009/cover.png",
        "pageCount":  1,
        "rotation":  0,
        "pageSize":  "595 x 805 pts",
        "sizeKB":  1065.2,
        "pages":  [
                      "certificates/cert-009/page-001.png"
                  ]
    },
    {
        "id":  "cert-010",
        "title":  "团队-获奖证书（核对） 163",
        "sourceName":  "团队-获奖证书（核对）_163.pdf",
        "cover":  "certificates/cert-010/cover.png",
        "pageCount":  1,
        "rotation":  0,
        "pageSize":  "841.9 x 595.3 pts (A4)",
        "sizeKB":  507.7,
        "pages":  [
                      "certificates/cert-010/page-001.png"
                  ]
    }
] as const;

export const certificateGalleryItems: CertificateGalleryItem[] = rawCertificates.map((item) => ({
  ...item,
  cover: publicAsset(item.cover),
  pages: item.pages.map((page) => publicAsset(page)),
}));

export function getCertificateById(id: string) {
  return certificateGalleryItems.find((item) => item.id === id);
}
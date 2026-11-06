export const tomPhotos = [
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/fbbd38e4-5ee5-4e7a-9a58-def77b4095bc/IMG_6838.JPEG",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/b406bde7-c0ff-4db4-a410-97e8e5792a24/IMG_6846.JPEG",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/5467c7a6-5196-4f26-aa33-744a8cc3203b/IMG_6947.JPEG",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/475487b4-92a8-4ece-bf3f-11fddbdef9c1/IMG_6964.JPEG",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/2397734c-18f0-4115-ab54-b31ae005fc5e/IMG_6971.JPEG",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/259360cb-5867-401b-ad17-dc43ad924b0d/20221224_171333040_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/f9f39327-7135-4486-a2ac-92b02407a49b/20230319_151630936_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/13f1393f-05ce-4b02-983c-e2a656de66d8/20230321_145906059_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/0d60d602-1177-44e4-91e7-f9b4d2e68281/20230407_125126166_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/9ed0e0b4-c3cb-4bd4-bfe1-c83fa8efb69f/20230805_161421381_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/00765f2a-2904-4895-82c0-f709397b139d/20240302_150121738_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/648ddb91-f688-40ff-8e61-6024773508ee/20240520_143827184_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/f594e229-16e9-4c3d-a44b-c7a1d02ebb55/20240525_140629773_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/c16126e2-cffe-4412-9dc6-cf31545801cd/20250803_184227807_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/0fd66532-8a52-4828-aa48-38b854e443b5/20220725_191340102_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/26a3288a-0e33-4749-8c78-c81858a7183a/20230714_123642846_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/adaa930d-dc02-46a2-b83e-7576f6ad7e85/20260808_124731223_iOS-1793964398130.png",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/d0871d3f-2719-43aa-a6e6-d8892fc74ae8/20261003_163512677_iOS-1793964236431.png",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/c93e0621-68f5-4aec-8df9-7a0f4d942224/20230407_105018268_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/74f23e45-2350-4b2f-8942-6ba5c0d1ce74/20230319_164006632_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/babf610f-bd8c-4e81-9e7f-783e0e02fc68/20260706_164234802_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/fced5b51-3b8a-4d0d-80f4-41bbc926d448/20240427_221746212_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/278b4104-bc71-416f-89f4-c1800d34d21d/20260806_162141756_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/3c303ec7-98b1-4628-a622-c0e3138f849e/20260802_155623024_iOS.jpg",
  "https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/30b319ed-0ad2-4c30-a4e9-6c321b1084e5/20261024_090736130_iOS.jpg",
];

export function getFallbackPhoto(id: string): string {
  const index =
    id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    tomPhotos.length;
  return tomPhotos[index];
}

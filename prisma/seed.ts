import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Bắt đầu seed data...')

  // 1. Tạo Admin mặc định
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  })
  console.log(`Đã tạo tài khoản admin: ${admin.username}`)

  // Xóa data cũ (tùy chọn) để khi chạy nhiều lần không bị trùng
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()

  // 2. Tạo sản phẩm mẫu
  const productsData = [
    {
      name: "Sofa Vải Cao Cấp",
      price: 8500000,
      category: "Nội thất",
      subCategory: "Ghế",
      material: "Vải bọc nhập khẩu, khung gỗ sồi",
      size: "200cm x 85cm x 75cm",
      description: "Sofa thiết kế hiện đại, phù hợp cho phòng khách gia đình và chung cư. Đệm mút D40 đàn hồi tốt, không xẹp lún.",
    },
    {
      name: "Bàn Trà Gỗ Sồi",
      price: 3200000,
      category: "Nội thất",
      subCategory: "Bàn",
      material: "Gỗ sồi tự nhiên nguyên khối",
      size: "120cm x 60cm x 45cm",
      description: "Bàn trà phong cách tối giản Nhật Bản. Bề mặt phủ melamine chống trầy xước.",
    },
    {
      name: "Tủ Quần Áo Gỗ Công Nghiệp",
      price: 4500000,
      category: "Nội thất",
      subCategory: "Tủ",
      material: "Gỗ MDF lõi xanh chống ẩm",
      size: "180cm x 200cm x 60cm",
      description: "Tủ quần áo 3 cánh thiết kế hiện đại tối giản. Tối ưu hóa không gian lưu trữ cho phòng ngủ.",
    },
    {
      name: "Kệ Sách Treo Tường",
      price: 850000,
      category: "Nội thất",
      subCategory: "Kệ",
      material: "Gỗ thông tự nhiên sơn phủ PU",
      size: "100cm x 30cm x 25cm",
      description: "Kệ sách treo tường thiết kế giấu ngàm, dễ dàng lắp đặt, chịu lực lên đến 20kg.",
    },
    {
      name: "Combo Phòng Ngủ Hiện Đại",
      price: 15500000,
      category: "Nội thất",
      subCategory: "Combo",
      material: "Gỗ MDF phủ Melamine cao cấp",
      size: "Nhiều kích thước",
      description: "Trọn bộ nội thất phòng ngủ gồm giường ngủ, tủ quần áo, tab đầu giường và bàn trang điểm.",
    },
    {
      name: "Ghế Thư Giãn Đọc Sách",
      price: 2500000,
      category: "Nội thất",
      subCategory: "Ghế",
      material: "Khung sắt sơn tĩnh điện, nệm bọc da",
      size: "70cm x 80cm x 95cm",
      description: "Ghế lười đọc sách với thiết kế công thái học, giúp thư giãn thoải mái sau một ngày làm việc.",
    },
    {
      name: "Thảm Trải Sàn Bắc Âu",
      price: 1200000,
      category: "Nội thất",
      subCategory: "Khác",
      material: "Sợi tổng hợp cao cấp, mặt đáy chống trượt",
      size: "160cm x 230cm",
      description: "Thảm trải sàn họa tiết hình học phong cách Bắc Âu, phù hợp cho phòng khách hoặc phòng ngủ.",
    },
    {
      name: "Cây Thông Noel Mini Dể Bàn",
      price: 450000,
      category: "Noel",
      subCategory: "Cây Thông",
      material: "Nhựa PE cao cấp, chậu gốm",
      size: "Cao 45cm",
      description: "Cây thông Noel mini trang trí sẵn với trái châu đỏ, chuông và dây kim tuyến. Phù hợp đặt trên bàn làm việc.",
    },
    {
      name: "Vòng Nguyệt Quế Treo Cửa",
      price: 350000,
      category: "Noel",
      subCategory: "Treo",
      material: "Lá thông nhân tạo, quả thông khô",
      size: "Đường kính 40cm",
      description: "Vòng nguyệt quế phong cách châu Âu, điểm xuyết ruy băng nhung đỏ.",
    },
    {
      name: "Quả Châu Đỏ Trang Trí",
      price: 150000,
      category: "Noel",
      subCategory: "Topping",
      material: "Nhựa cao cấp mạ bóng",
      size: "Đường kính 6cm",
      description: "Set 10 quả châu đỏ tươi tắn, phụ kiện không thể thiếu để trang trí cây thông.",
    },
    {
      name: "Tiểu Cảnh Hang Đá Chúa Hài Đồng",
      price: 850000,
      category: "Noel",
      subCategory: "Tiểu Cảnh",
      material: "Gỗ ép, nhựa, rêu nhân tạo",
      size: "40cm x 30cm x 25cm",
      description: "Tiểu cảnh hang đá Giáng sinh chân thực, có tích hợp đèn LED ấm áp.",
    },
    {
      name: "Quả Cầu Tuyết Thủy Tinh",
      price: 250000,
      category: "Noel",
      subCategory: "Bàn",
      material: "Thủy tinh, đế nhựa dán gỗ",
      size: "15cm x 10cm",
      description: "Quả cầu tuyết phong cách vintage với hình ảnh người tuyết và ông già Noel bên trong.",
    },
    {
      name: "Dây Đèn Đom Đóm",
      price: 100000,
      category: "Noel",
      subCategory: "Khác",
      material: "Dây đồng, nhựa",
      size: "Dài 5m",
      description: "Dây đèn LED đom đóm màu vàng ấm dùng để trang trí thêm.",
    },
    {
      name: "Set Lì Xì Đỏ Phúc Lộc",
      price: 120000,
      category: "Tết",
      material: "Giấy mỹ thuật dày dặn, ép kim",
      size: "17cm x 9cm",
      description: "Set 10 bao lì xì đỏ thiết kế độc quyền với họa tiết mai vàng ép kim sắc nét.",
    },
    {
      name: "Bình Hoa Mai Giả Cao Cấp",
      price: 850000,
      category: "Tết",
      material: "Lụa cao cấp, thân thép bọc nhựa",
      size: "Cao 90cm",
      description: "Cành mai vàng rực rỡ, cánh hoa mềm mại chân thật. Tặng kèm bình gốm Bát Tràng.",
    },
    {
      name: "Bó Hoa Khô Vintage",
      price: 250000,
      category: "Hoa khô",
      material: "Hoa lavender, lúa mạch khô tự nhiên",
      size: "Cao 50cm",
      description: "Hoa sấy lạnh giữ nguyên màu sắc tự nhiên và hương thơm nhẹ nhàng. Thích hợp trang trí không gian hoài cổ.",
    },
    {
      name: "Lọ Cỏ Đuôi Thỏ",
      price: 180000,
      category: "Hoa khô",
      material: "Cỏ đuôi thỏ sấy khô",
      size: "Cao 30cm",
      description: "Cỏ đuôi thỏ trắng muốt, cắm trong lọ thủy tinh trong suốt xinh xắn.",
    }
  ]

  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        ...p,
        images: {
          create: [
            { url: "/uploads/placeholder.jpg", isMain: true, order: 0 },
            { url: "/uploads/placeholder.jpg", isMain: false, order: 1 }
          ]
        }
      }
    })
    console.log(`Đã tạo sản phẩm: ${product.name}`)
  }

  console.log('Seed data hoàn tất!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

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
      material: "Vải bọc nhập khẩu, khung gỗ sồi",
      size: "200cm x 85cm x 75cm",
      description: "Sofa thiết kế hiện đại, phù hợp cho phòng khách gia đình và chung cư. Đệm mút D40 đàn hồi tốt, không xẹp lún.",
    },
    {
      name: "Bàn Trà Gỗ Sồi",
      price: 3200000,
      category: "Nội thất",
      material: "Gỗ sồi tự nhiên nguyên khối",
      size: "120cm x 60cm x 45cm",
      description: "Bàn trà phong cách tối giản Nhật Bản. Bề mặt phủ melamine chống trầy xước.",
    },
    {
      name: "Cây Thông Noel Mini Dể Bàn",
      price: 450000,
      category: "Noel",
      material: "Nhựa PE cao cấp, chậu gốm",
      size: "Cao 45cm",
      description: "Cây thông Noel mini trang trí sẵn với trái châu đỏ, chuông và dây kim tuyến. Phù hợp đặt trên bàn làm việc.",
    },
    {
      name: "Vòng Nguyệt Quế Treo Cửa",
      price: 350000,
      category: "Noel",
      material: "Lá thông nhân tạo, quả thông khô",
      size: "Đường kính 40cm",
      description: "Vòng nguyệt quế phong cách châu Âu, điểm xuyết ruy băng nhung đỏ.",
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

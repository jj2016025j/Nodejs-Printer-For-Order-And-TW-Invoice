from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# 创建PDF文件
c = canvas.Canvas("hello.pdf", pagesize=letter)
c.drawString(100, 750, "Hello, ReportLab!")

# 保存PDF文件
c.save()

import subprocess

# 示例：在Linux系統上執行lsusb命令來列出USB設備
result = subprocess.run(['lsusb'], capture_output=True, text=True)
print(result.stdout)  # 輸出命令執行結果，即USB設備列表

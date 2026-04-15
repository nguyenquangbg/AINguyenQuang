import type { Translation } from './types';

export const locales: { [key: string]: Translation } = {
  vi: {
    controls: {
      languageTooltip: 'Switch to English',
      backlightDirection: {
        title: 'Hướng ngược sáng (1 đèn)',
        left: 'Trái',
        middle: 'Giữa',
        right: 'Phải',
      },
      lightType: {
        title: 'Loại ánh sáng',
        natural: 'Tự nhiên',
        oneLight: '1 đèn',
        twoLights: '2 đèn',
        threeLights: '3 đèn',
      },
      lightColor: {
        light1: 'Đèn 1',
        light2: 'Đèn 2',
        light3: 'Đèn 3',
      },
      quality: {
        title: 'Chất lượng đầu ra',
        standard: 'Tiêu chuẩn',
        q2k: '2K',
        q4k: '4K',
      },
      customPrompt: {
        title: 'Yêu cầu thêm',
        placeholder: 'ví dụ: thêm hiệu ứng khói, tông màu điện ảnh...',
      },
      relightButton: 'Thay đổi ánh sáng',
      relightingButton: 'Đang xử lý...',
    },
    imageDisplay: {
      original: 'Ảnh Gốc',
      edited: 'Ảnh Đã Chỉnh Sửa',
      uploadPrompt: 'Tải ảnh của bạn lên để bắt đầu.',
      resultPrompt: 'Kết quả sẽ xuất hiện ở đây.',
      downloadButton: 'Tải Ảnh Xuống (PNG)',
    },
    postProcessing: {
      title: 'Hậu kỳ',
      temperature: 'Nhiệt độ màu',
      exposure: 'Phơi sáng',
      contrast: 'Tương phản',
      highlights: 'Vùng sáng',
      shadows: 'Vùng tối',
      saturation: 'Độ bão hòa',
      resetButton: 'Đặt lại tất cả',
    },
    loadingMessages: [
      'Đang phân tích ảnh của bạn...',
      'Chuẩn bị thiết lập ánh sáng studio...',
      'AI đang áp dụng hiệu ứng ánh sáng...',
      'Tinh chỉnh bóng đổ và vùng sáng...',
      'Hoàn tất và kết xuất hình ảnh...',
    ],
    error: {
      title: 'Đã có lỗi xảy ra',
      generationFailed: 'Không thể tạo ảnh. Yêu cầu của bạn có thể đã bị AI từ chối.',
      unexpected: 'Đã xảy ra lỗi không mong muốn.',
    },
  },
  en: {
    controls: {
      languageTooltip: 'Chuyển sang Tiếng Việt',
      backlightDirection: {
        title: 'Backlight Direction (1 Light)',
        left: 'Left',
        middle: 'Middle',
        right: 'Right',
      },
      lightType: {
        title: 'Light Type',
        natural: 'Natural',
        oneLight: '1 Light',
        twoLights: '2 Lights',
        threeLights: '3 Lights',
      },
      lightColor: {
        light1: 'Light 1',
        light2: 'Light 2',
        light3: 'Light 3',
      },
      quality: {
        title: 'Output Quality',
        standard: 'Standard',
        q2k: '2K',
        q4k: '4K',
      },
      customPrompt: {
        title: 'Custom Prompt',
        placeholder: 'e.g., add smoke effect, cinematic tone...',
      },
      relightButton: 'Relight Image',
      relightingButton: 'Processing...',
    },
    imageDisplay: {
      original: 'Original Image',
      edited: 'Edited Image',
      uploadPrompt: 'Upload your photo to start.',
      resultPrompt: 'Your result will appear here.',
      downloadButton: 'Download Image (PNG)',
    },
    postProcessing: {
      title: 'Post-Processing',
      temperature: 'Temperature',
      exposure: 'Exposure',
      contrast: 'Contrast',
      highlights: 'Highlights',
      shadows: 'Shadows',
      saturation: 'Saturation',
      resetButton: 'Reset All',
    },
    loadingMessages: [
      'Analyzing your image...',
      'Preparing studio lighting setup...',
      'AI is applying lighting effects...',
      'Refining shadows and highlights...',
      'Finalizing and rendering image...',
    ],
    error: {
      title: 'An error occurred',
      generationFailed: 'Failed to generate image. Your request might have been denied by the AI.',
      unexpected: 'An unexpected error occurred.',
    },
  },
};

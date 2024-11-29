export {};

declare global {
  interface Window {
    paypal: any; // Bạn có thể thay thế `any` bằng kiểu chi tiết hơn nếu cần
  }
}
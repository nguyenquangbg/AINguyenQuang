export interface University {
  id: string;
  name: string;
  logoUrl: string;
  mainColor: string; // hex color for the header
  acronym: string;
}

export const UNIVERSITIES: University[] = [
  { id: 'ulsa', name: 'Đại học Lao động - Xã hội', logoUrl: 'https://i.imgur.com/vHq2i76.png', mainColor: '#003366', acronym: 'ULSA' },
  { id: 'phuongdong', name: 'Đại học Phương Đông', logoUrl: 'https://i.imgur.com/GQqg08x.png', mainColor: '#0D244F', acronym: 'PDU' },
  { id: 'aof', name: 'Học viện Tài chính', logoUrl: 'https://i.imgur.com/2s422F5.png', mainColor: '#003366', acronym: 'AOF' },
  { id: 'hust', name: 'Đại học Bách khoa Hà Nội', logoUrl: 'https://i.imgur.com/Q60R1p2.png', mainColor: '#A62139', acronym: 'HUST' },
  { id: 'ueh', name: 'Đại học Kinh tế TP.HCM', logoUrl: 'https://i.imgur.com/L5a2zG2.png', mainColor: '#004A99', acronym: 'UEH' },
  { id: 'fpt', name: 'Đại học FPT', logoUrl: 'https://i.imgur.com/g05sC8w.png', mainColor: '#FF6600', acronym: 'FPT' },
  { id: 'tdtu', name: 'Đại học Tôn Đức Thắng', logoUrl: 'https://i.imgur.com/gY9N3s3.png', mainColor: '#0067AC', acronym: 'TDTU' },
  { id: 'custom', name: 'Tên tùy chỉnh...', logoUrl: '', mainColor: '#003366', acronym: 'EDIT' },
];
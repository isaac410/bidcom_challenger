export interface ILinkTracker {
  id?: string;
  link: string;
  target: string;
  valid: boolean;
  password: string;
  visited: number;
  expiration: string;
}

interface GetNetDevice {
  ip_address: string;
  device_id: string;
  manufacturer?: string;
  model?: string;
  os_version?: string;
  platform?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
}

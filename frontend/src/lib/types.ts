export type InventoryItem = {
  id: string;
  product_name: string;
  stock_level: number;
  category: string;
  reorder_threshold: number;
  image_url?: string | null;
};

export type CampaignPayload = {
  subject: string;
  preview: string;
  target_audience: string;
  html: string;
  raw?: string;
};

export type StreamEventType =
  | "agent_start"
  | "thought"
  | "tool"
  | "output"
  | "campaign"
  | "done"
  | "error";

export type StreamEvent = {
  type: StreamEventType;
  agent?: string | null;
  message: string;
  data?: CampaignPayload | Record<string, unknown> | null;
};

export type WorkflowStatus = "idle" | "running" | "complete" | "error";

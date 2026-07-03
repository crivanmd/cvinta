import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "#1F6F54",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 48 48">
          <path
            d="M17 13h9.5l4.5 4.5V35a1 1 0 0 1-1 1H17a1 1 0 0 1-1-1V14a1 1 0 0 1 1-1z"
            fill="none"
            stroke="#FAFAF7"
            strokeWidth="2.4"
          />
          <path
            d="M19.5 25.5l3 3 6-6.5"
            fill="none"
            stroke="#FAFAF7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}

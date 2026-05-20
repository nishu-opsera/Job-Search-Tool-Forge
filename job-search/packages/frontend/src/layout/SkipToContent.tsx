import { Link } from "@mui/material";

export function SkipToContent() {
  return (
    <Link
      href="#main-content"
      sx={{
        position: "absolute",
        left: -9999,
        top: "auto",
        width: 1,
        height: 1,
        overflow: "hidden",
        zIndex: 9999,
        "&:focus": {
          position: "fixed",
          left: 16,
          top: 16,
          width: "auto",
          height: "auto",
          overflow: "visible",
          px: 2,
          py: 1,
          bgcolor: "background.paper",
          color: "primary.main",
          boxShadow: 3,
          borderRadius: 1,
        },
      }}
    >
      Skip to main content
    </Link>
  );
}

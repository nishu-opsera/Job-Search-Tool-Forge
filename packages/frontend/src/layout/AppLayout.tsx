import FilterListIcon from "@mui/icons-material/FilterList";
import {
  AppBar,
  Box,
  Container,
  Dialog,
  Fab,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SEARCH_DISCLAIMER } from "@job-search/shared";
import { useState, type ReactNode } from "react";
import { SkipToContent } from "./SkipToContent.js";

export interface AppLayoutProps {
  filterSlot?: ReactNode;
  resultsSlot?: ReactNode;
}

export function AppLayout({
  filterSlot,
  resultsSlot,
}: AppLayoutProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = filterSlot ?? (
    <Typography variant="body2" color="text.secondary">
      Filters will appear here (WO-013).
    </Typography>
  );

  const results = resultsSlot ?? (
    <Typography variant="body2" color="text.secondary">
      Search results will appear here (WO-015).
    </Typography>
  );

  return (
    <>
      <SkipToContent />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppBar position="static" component="header" role="banner">
          <Toolbar>
            <Typography variant="h1" component="h1" sx={{ fontSize: "1.25rem" }}>
              Job Search Tool
            </Typography>
          </Toolbar>
        </AppBar>

        <Container
          component="main"
          id="main-content"
          maxWidth="lg"
          sx={{ flex: 1, py: 3 }}
          tabIndex={-1}
        >
          {isDesktop ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "320px 1fr",
                gap: 3,
                alignItems: "start",
              }}
            >
              <Box
                component="aside"
                aria-label="Search filters"
                sx={{
                  bgcolor: "background.paper",
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Typography variant="h2" component="h2" gutterBottom>
                  Filters
                </Typography>
                {filters}
              </Box>
              <Box component="section" aria-label="Search results">
                <Typography variant="h2" component="h2" gutterBottom>
                  Results
                </Typography>
                {results}
              </Box>
            </Box>
          ) : (
            <Box>
              <Box component="section" aria-label="Search results" sx={{ mb: 2 }}>
                <Typography variant="h2" component="h2" gutterBottom>
                  Results
                </Typography>
                {results}
              </Box>
              <Fab
                color="primary"
                aria-label="Open search filters"
                onClick={() => setMobileFiltersOpen(true)}
                sx={{ position: "fixed", bottom: 24, right: 24 }}
              >
                <FilterListIcon />
              </Fab>
              <Dialog
                fullScreen
                open={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
                aria-labelledby="mobile-filters-title"
              >
                <AppBar sx={{ position: "relative" }}>
                  <Toolbar>
                    <Typography id="mobile-filters-title" variant="h2" component="h2">
                      Filters
                    </Typography>
                  </Toolbar>
                </AppBar>
                <Box sx={{ p: 2 }} component="aside" aria-label="Search filters">
                  {filters}
                </Box>
              </Dialog>
            </Box>
          )}
        </Container>

        <Box
          component="footer"
          role="contentinfo"
          sx={{
            py: 2,
            px: 2,
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary">
              {SEARCH_DISCLAIMER}
            </Typography>
          </Container>
        </Box>
      </Box>
    </>
  );
}

import { m } from "framer-motion";

import { Box, Button, Typography } from "@mui/material";

import { varFade, MotionContainer } from "src/components/animate";
import {
  Carousel,
  useCarousel,
  CarouselArrowNumberButtons,
} from "src/components/carousel";

// ----------------------------------------------------------------------

export function AppCarousel({ data }) {
  const carousel = useCarousel();

  return (
    <Box sx={{ position: "relative" }}>
      <Carousel carousel={carousel} sx={{ borderRadius: 2 }}>
        {data.map((item, index) => (
          <CarouselItem
            key={item.id}
            //
            item={item}
            selected={index === carousel.dots.selectedIndex}
          />
        ))}
      </Carousel>

      <CarouselArrowNumberButtons
        {...carousel.arrows}
        options={carousel.options}
        totalSlides={carousel.dots.dotCount}
        selectedIndex={carousel.dots.selectedIndex + 1}
        sx={{ top: 16, right: 16, position: "absolute" }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

function CarouselItem({ item, selected }) {
  return (
    <Box sx={{ position: "relative", height: 280 }}>
      <Box
        component="img"
        alt={item.title}
        src={item.featured_image}
        sx={{ objectFit: "cover", aspectRatio: { xs: "4/3", sm: "16/10" } }}
      />

      <Box
        sx={(theme) => ({
          top: 0,
          width: 1,
          height: 1,
          position: "absolute",
          backgroundImage: `linear-gradient(to top, ${theme.vars.palette.grey[900]}, transparent)`,
        })}
      />

      <Box
        component={MotionContainer}
        animate={selected}
        action
        sx={{
          p: 3,
          left: 0,
          width: 1,
          bottom: 0,
          position: "absolute",
          color: "common.white",
        }}
      >
        <m.div variants={varFade("inRight")}>
          <Typography
            noWrap
            sx={{ mb: 1, typography: { xs: "subtitle1", md: "h3" } }}
          >
            {item.title}
          </Typography>
        </m.div>

        <m.div variants={varFade("inRight")}>
          <Typography noWrap variant="body2">
            {item.description}
          </Typography>
        </m.div>

        <m.div variants={varFade("inRight")}>
          <Button
            color="primary"
            variant="contained"
            sx={{ mt: 3, display: { xs: "none", sm: "inline-flex" } }}
            onClick={() => window.open(item.url, "_blank")}
          >
            {item.button_text}
          </Button>
        </m.div>
      </Box>
    </Box>
  );
}

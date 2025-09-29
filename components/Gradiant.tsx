import {
  Blur,
  Canvas,
  RadialGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");
const VISUAL_CONFIG = {
  blur: 9,
  center: {
    x: width / 2,
    y: height / 2,
  },
} as const;
const ANIMATION_CONFIG = {
  durations: {
    MOUNT: 2000,
    SPEAKING_TRANSITION: 600,
    QUIET_TRANSITION: 400,
    PULSE: 1000,
  },
  spring: {
    damping: 10,
    stiffness: 50,
  },
} as const;
const RADIOUS_CONFIG = {
  minScale: 0.6,
  maxScale: 1.4,
  speakingScale: 1.0,
  quietScale: 0.6,
  baseRadius: {
    default: width,
    speaking: width / 4,
  },
} as const;

type GradientPosition = "top" | "center" | "bottom";

interface GradiantProps {
  position: GradientPosition;
  isSpeaking: boolean;
}

const Gradient = ({ position, isSpeaking }: GradiantProps) => {
  const animatedY = useSharedValue(100);
  const radiusScale = useSharedValue(1);
  const baseRadiusValue = useSharedValue(RADIOUS_CONFIG.baseRadius.default);
  const mountRadius = useSharedValue(0);

  const center = useDerivedValue(() => {
    return vec(VISUAL_CONFIG.center.x, animatedY.value);
  });

  const calculateRadiusbounds = (baseRadius: number) => {
    "worklet";
    return {
      min: baseRadius * RADIOUS_CONFIG.minScale,
      max: baseRadius * RADIOUS_CONFIG.maxScale,
    };
  };
  const calculateTargetRadius = (baseRadius: number, isSpeaking: boolean) => {
    "worklet";
    const { min, max } = calculateRadiusbounds(baseRadius);
    const scale = isSpeaking
      ? RADIOUS_CONFIG.speakingScale
      : RADIOUS_CONFIG.quietScale;

    return min + (max - min) * scale;
  };
  const animatedRadius = useDerivedValue(() => {
    const { min, max } = calculateRadiusbounds(baseRadiusValue.value);
    const calculatedRadius = min + (max - min) * radiusScale.value;
    return mountRadius.value < calculatedRadius
      ? mountRadius.value
      : calculatedRadius;
  });

  const getTargetY = (pos: GradientPosition): number => {
    switch (pos) {
      case "top":
        return 0;
      case "center":
        return VISUAL_CONFIG.center.y;
      case "bottom":
        return height;
      default:
        return VISUAL_CONFIG.center.y;
    }
  };
  React.useEffect(() => {
    const targetY = getTargetY(position);
    animatedY.value = withSpring(targetY, ANIMATION_CONFIG.spring);
  }, [position, animatedY]);

  React.useEffect(() => {
    animatedY.value = getTargetY(position);
  }, []);

  React.useEffect(() => {
    const targetRadius = calculateTargetRadius(
      RADIOUS_CONFIG.baseRadius.default,
      isSpeaking
    );
    mountRadius.value = withTiming(targetRadius, {
      duration: ANIMATION_CONFIG.durations.MOUNT,
    });
  }, []);
  React.useEffect(() => {
    const duration = ANIMATION_CONFIG.durations.SPEAKING_TRANSITION;
    if (isSpeaking) {
      baseRadiusValue.value = withTiming(RADIOUS_CONFIG.baseRadius.speaking);
      animatedY.value = withTiming(getTargetY("center"), { duration });
    } else {
      baseRadiusValue.value = withTiming(RADIOUS_CONFIG.baseRadius.default);
      animatedY.value = withTiming(getTargetY(position), { duration });
    }
  }, [isSpeaking, baseRadiusValue, animatedY, position]);

  React.useEffect(() => {
    if (isSpeaking) {
      radiusScale.value = withRepeat(
        withTiming(RADIOUS_CONFIG.speakingScale, {
          duration: ANIMATION_CONFIG.durations.PULSE,
        }),
        -1,
        true
      );
    } else {
      radiusScale.value = withTiming(RADIOUS_CONFIG.quietScale, {
        duration: ANIMATION_CONFIG.durations.QUIET_TRANSITION,
      });
    }
  }, [isSpeaking, radiusScale]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={center}
            r={animatedRadius}
            colors={[
              Colors.mediumBlue,
              Colors.lightblue,
              Colors.teal,
              Colors.iceBlue,
              Colors.while,
            ]}
          />

          <Blur blur={VISUAL_CONFIG.blur} mode={"clamp"} />
        </Rect>
      </Canvas>
    </View>
  );
};
const Colors = {
  while: "#ffffff",
  teal: "#5AC8FA",
  mediumBlue: "#007AFA",
  lightblue: "#4DA6FF",
  iceBlue: "#E6F3FF",
};

export default Gradient;

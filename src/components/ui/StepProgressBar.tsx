import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STEPS = [
  { num: 1, label: 'Completa' },
  { num: 2, label: 'Transfiere' },
  { num: 3, label: 'Constancia' },
];

interface StepProgressBarProps {
  current: 1 | 2 | 3;
}

function ActiveDot() {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.35, duration: 750, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 750, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width: 15,
        height: 15,
        borderRadius: 10,
        backgroundColor: '#0B1629',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale }],
      }}
    >
      {/* Teal inner dot marks the active step */}
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#00E3C2' }} />
    </Animated.View>
  );
}

export default function StepProgressBar({ current }: StepProgressBarProps) {
  return (
    <View style={{ backgroundColor: '#F6F6F9', paddingHorizontal: 24, paddingVertical: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {STEPS.map((step, i) => {
          const done = step.num < current;
          const active = step.num === current;

          return (
            <React.Fragment key={step.num}>
              <View style={{ alignItems: 'center', width: 64 }}>
                {active ? (
                  <ActiveDot />
                ) : (
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: 10,
                      backgroundColor: done ? '#0B1629' : '#A7A7A7',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {done && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                )}
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    fontWeight: active ? '700' : '400',
                    color: active ? '#060F26' : '#A7A7A7',
                    textAlign: 'center',
                  }}
                >
                  {step.label}
                </Text>
              </View>

              {i < STEPS.length - 1 && (
                <View
                  style={{
                    flex: 1,
                    height: 3,
                    marginTop: 7,
                    backgroundColor: done ? '#0B1629' : '#E5E7EB',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import MangoModal from '../components/MangoModal';
import { checkMangoDropAndGet } from '../utils/mangoUtils';

function ClickerScreen() {
  const [count, setCount] = useState(0);
  const [fallingMangos, setFallingMangos] = useState([]);
  const [fallingLeaves, setFallingLeaves] = useState([]);
  const [showClickAnimation, setShowClickAnimation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentMango, setCurrentMango] = useState(null);
  const nextMangoId = useRef(0);
  const nextLeafId = useRef(0);
  const lottieRef = useRef();
  const idleTimerRef = useRef(null);

  const startIdleTimer = () => {
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setShowClickAnimation(true);
    }, 4000);
  };

  useEffect(() => {
    startIdleTimer();
    return () => clearTimeout(idleTimerRef.current);
  }, []);

  const createFallingMango = () => {
    const mangoId = nextMangoId.current++;
    const startPosition = Math.random() * 200 - 90;
    const startHeight = Math.random() * 20 - 40;

    const newMango = {
      id: mangoId,
      animation: new Animated.ValueXY({ x: startPosition, y: startHeight }),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(0.5),
      shadowOpacity: new Animated.Value(0.2),
    };

    setFallingMangos(prev => [...prev, newMango]);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(newMango.animation.y, {
          toValue: startHeight - 10 - Math.random() * 20,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.cubic,
        }),
        Animated.timing(newMango.animation.y, {
          toValue: 200 + Math.random() * 50,
          duration: 700 + Math.random() * 200,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
      ]),
      Animated.sequence([
        Animated.timing(newMango.rotation, {
          toValue: Math.random() < 0.5 ? 360 : -360,
          duration: 850,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      Animated.sequence([
        Animated.spring(newMango.scale, {
          toValue: 1,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(newMango.scale, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.cubic,
        }),
      ]),
      Animated.sequence([
        Animated.spring(newMango.shadowOpacity, {
          toValue: 0.4,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(newMango.shadowOpacity, {
          toValue: 0.2,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.cubic,
        }),
      ]),
    ]).start(() => {
      setFallingMangos(prev => prev.filter(mango => mango.id !== mangoId));
    });
  };

  const createFallingLeaf = () => {
    const leafId = nextLeafId.current++;
    const startPosition = Math.random() * 200 - 90;
    const startHeight = Math.random() * 20 - 40;

    const newLeaf = {
      id: leafId,
      animation: new Animated.ValueXY({ x: startPosition, y: startHeight }),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(0.3),
    };

    setFallingLeaves(prev => [...prev, newLeaf]);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(newLeaf.animation.y, {
          toValue: 200 + Math.random() * 50,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      ]),
      Animated.sequence([
        ...Array(3).fill().map(() =>
          Animated.sequence([
            Animated.timing(newLeaf.animation.x, {
              toValue: startPosition + (Math.random() * 40 - 20),
              duration: 500,
              useNativeDriver: true,
              easing: Easing.sinIn,
            }),
            Animated.timing(newLeaf.animation.x, {
              toValue: startPosition - (Math.random() * 40 - 20),
              duration: 500,
              useNativeDriver: true,
              easing: Easing.sinOut,
            }),
          ])
        ),
      ]),
      Animated.sequence([
        Animated.timing(newLeaf.rotation, {
          toValue: Math.random() * 720 - 360,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]),
    ]).start(() => {
      setFallingLeaves(prev => prev.filter(leaf => leaf.id !== leafId));
    });
  };

  const handleClick = () => {
    setShowClickAnimation(false);
    startIdleTimer();
    
    const droppedMango = checkMangoDropAndGet();
    if (droppedMango) {
      setCurrentMango(droppedMango);
      setShowModal(true);
    }
    
    setCount(prev => prev + 1);
    createFallingMango();
    
    const leafCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < leafCount; i++) {
      setTimeout(() => createFallingLeaf(), i * 100);
    }
  };

  return (
    <View style={styles.container}>
      <MangoModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        mangoData={currentMango}
      />

      <View style={styles.overlay}>
        <View style={styles.scoreContainer}>
          <Image 
            source={require('../assets/images/Mango.png')}
            style={styles.mangoIcon}
          />
          <Text style={styles.scoreText}>{count.toLocaleString()}</Text>
        </View>

        <TouchableOpacity 
          onPress={handleClick} 
          style={styles.treeContainer}
          activeOpacity={1}
        >
          <LottieView
            source={require('../assets/animations/mango.json')}
            style={styles.treeAnimation}
            autoPlay={true}
            loop={true}
            speed={1}
          />
          
          {showClickAnimation && (
            <LottieView
              source={require('../assets/animations/click2.json')}
              style={styles.clickAnimation}
              autoPlay={true}
              loop={true}
              speed={1}
            />
          )}
        </TouchableOpacity>

        {fallingLeaves.map(leaf => (
          <Animated.Image
            key={leaf.id}
            source={require('../assets/images/leaf1.png')}
            style={[
              styles.fallingLeaf,
              {
                transform: [
                  { translateX: leaf.animation.x },
                  { translateY: leaf.animation.y },
                  {
                    rotate: leaf.rotation.interpolate({
                      inputRange: [-360, 360],
                      outputRange: ['-360deg', '360deg'],
                    }),
                  },
                  { scale: leaf.scale },
                ],
              },
            ]}
          />
        ))}

        {fallingMangos.map(mango => (
          <Animated.Image
            key={mango.id}
            source={require('../assets/images/Mango.png')}
            style={[
              styles.fallingMango,
              {
                transform: [
                  { translateX: mango.animation.x },
                  { translateY: mango.animation.y },
                  {
                    rotate: mango.rotation.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                  { scale: mango.scale },
                ],
                shadowOpacity: mango.shadowOpacity,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  overlay: {
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 1,
    elevation: 5,
  },
  mangoIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    elevation: 2,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00000066',
  },
  treeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  treeAnimation: {
    width: 200,
    height: 200,
  },
  clickAnimation: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: '50%',
    marginTop: -45,
    right: 40,
  },
  fallingMango: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: '45%',
    left: '50%',
    marginLeft: -15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fallingLeaf: {
    width: 15,
    height: 15,
    position: 'absolute',
    top: '45%',
    left: '50%',
    marginLeft: -7.5,
  },
});

export default ClickerScreen;
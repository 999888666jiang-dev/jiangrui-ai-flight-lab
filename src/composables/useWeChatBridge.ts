import { onMounted, ref } from 'vue';
import { useEnvironment } from './useEnvironment';

type WeixinBridge = {
  invoke?: (name: string, params: Record<string, never>, callback: () => void) => void;
};

type WindowWithWeixin = Window & {
  WeixinJSBridge?: WeixinBridge;
};

const bridgeReady = ref(false);
let listenerInstalled = false;

function getBridge() {
  return (window as WindowWithWeixin).WeixinJSBridge;
}

function markBridgeReady() {
  bridgeReady.value = true;
}

function installBridgeListener() {
  if (listenerInstalled || typeof window === 'undefined') return;
  listenerInstalled = true;

  if (getBridge()) {
    markBridgeReady();
    return;
  }

  document.addEventListener('WeixinJSBridgeReady', markBridgeReady, false);
}

export function useWeChatBridge() {
  const environment = useEnvironment();

  onMounted(installBridgeListener);

  async function playInlineVideo(video: HTMLVideoElement) {
    if (!environment.isWeChat.value) {
      await video.play();
      return;
    }

    const bridge = getBridge();
    if (!bridge?.invoke) {
      await video.play();
      return;
    }

    await new Promise<void>((resolve, reject) => {
      bridge.invoke?.('getNetworkType', {}, () => {
        video.play().then(resolve).catch(reject);
      });
    });
  }

  return {
    bridgeReady,
    playInlineVideo,
  };
}

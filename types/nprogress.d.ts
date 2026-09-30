declare module 'nprogress' {
  interface NProgress {
    configure(options?: Record<string, unknown>): NProgress;
    set(progress: number): NProgress;
    start(): NProgress;
    done(force?: boolean): NProgress;
    inc(amount?: number): NProgress;
    remove(): NProgress;
    isStarted(): boolean;
  }

  const NProgress: NProgress;

  export default NProgress;
}

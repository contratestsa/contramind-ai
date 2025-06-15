// Simplified toast system to avoid React hooks issues
export function useToast() {
  return {
    toasts: [],
    toast: (props: any) => {
      // Simple console log for debugging - can be enhanced later
      console.log('Toast:', props.title, props.description);
    },
    dismiss: () => {},
  };
}

export function toast(props: any) {
  console.log('Toast:', props.title, props.description);
}


export interface PageWithBackProps {
  onBack: () => void;
}

export interface PageWithPageChangeProps {
  onPageChange: (page: string) => void;
}

export interface PageProps extends PageWithBackProps, PageWithPageChangeProps {}

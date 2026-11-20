// Page-width wrapper: 20px side padding on phones, growing on larger screens
export default function Container({ as: Tag = "div", className = "", ...props }) {
  return <Tag className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`} {...props} />;
}

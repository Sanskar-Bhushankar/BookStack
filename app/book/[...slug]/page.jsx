import BookDetailsPage from "../../../components/BookDetailsPage";

export default function BookDetails({ params }) {
  // params.slug will be an array, e.g., ['works', 'OL8894965W']
  const open_library_key = `/${params.slug.join('/')}`;

  return <BookDetailsPage openLibraryKey={open_library_key} />;
} 
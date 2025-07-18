import BookDetailsPage from "../../../components/BookDetailsPage";

export default async function BookDetails({ params }) {
  // params.slug will be an array, e.g., ['works', 'OL8894965W']
  const awaitedParams = await params;
  const open_library_key = `/${awaitedParams.slug.join('/')}`;

  return <BookDetailsPage openLibraryKey={open_library_key} />;
} 
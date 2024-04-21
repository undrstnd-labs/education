export default function Page({ params }: { params: { section: string } }) {
  return <>section {params.section} </>
}

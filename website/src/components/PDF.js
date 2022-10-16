import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ReactPdf = ({url}) => {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};

	const goToPrevPage = () =>
		setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

	const goToNextPage = () =>
		setPageNumber(
			pageNumber + 1 >= numPages ? numPages : pageNumber + 1,
		);

	return (
		<div>
			<nav>
				<button onClick={goToPrevPage}>Prev</button>
				<button onClick={goToNextPage}>Next</button>
				<p>
					Page {pageNumber} of {numPages}
				</p>
			</nav>
			<Document
				file={url}
       
				onLoadSuccess={onDocumentLoadSuccess}
			>
				<Page pageNumber={pageNumber}  orientation="landscape" size={[153, 243]}/>
			</Document>      
		</div>
	);
};

export {ReactPdf };

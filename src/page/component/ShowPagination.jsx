import React from "react";
import { Pagination } from "react-bootstrap";

const style = {
    paddingTop: '5px',
    paddingBottom: '3px',
}

const ShowPagination = React.forwardRef((props, ref) => {
    const { jumpFunction } = props;
    const { totalPages, number, first, last } = props.data;

    const jumpPage = (pageNumber) => {
        jumpFunction(pageNumber);
    }
    return (
        <Pagination style={style}>
            {!first && <Pagination.First onClick={() => jumpPage(0)} />}
            {number > 0 && <Pagination.Prev onClick={() => jumpPage(number - 1)} />}
            {number - 3 > 0 && <Pagination.Item onClick={() => jumpPage(0)}>{1}</Pagination.Item>}
            {number - 2 > 0 && <Pagination.Ellipsis />}

            {number - 1 > 0 && <Pagination.Item onClick={() => jumpPage(number - 2)}>{number - 1}</Pagination.Item>}
            {number > 0 && <Pagination.Item onClick={() => jumpPage(number - 1)}>{number}</Pagination.Item>}
            <Pagination.Item active>{number + 1}</Pagination.Item>
            {number + 1 < totalPages && <Pagination.Item onClick={() => jumpPage(number + 1)}>{number + 2}</Pagination.Item>}
            {number + 2 < totalPages && <Pagination.Item onClick={() => jumpPage(number + 2)}>{number + 3}</Pagination.Item>}

            {number + 3 < totalPages && <Pagination.Ellipsis />}
            {number + 3 < totalPages - 1 && <Pagination.Item onClick={() => jumpPage(totalPages - 1)}>{totalPages}</Pagination.Item>}
            {number + 1 < totalPages && <Pagination.Next onClick={() => jumpPage(number + 1)} />}
            {!last && <Pagination.Last onClick={() => jumpPage(totalPages - 1)} />}
        </Pagination>
    );
})

export default ShowPagination;
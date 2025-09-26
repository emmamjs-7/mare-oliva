
import { useFetcher } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";

type Props = {
  id: number | string;
  name?: string;
  variant?: string;
  className?: string;
};

export default function DeleteButton({
  id, name, variant = "outline-danger", className,
}: Props) {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";

  const [show, setShow] = useState(false);
  const wasBusy = useRef(false);
  useEffect(() => {
    if (wasBusy.current && !busy) setShow(false);
    wasBusy.current = busy;
  }, [busy]);

  return (<>
    <Button
      variant={variant}
      className={className}
      onClick={() => setShow(true)}
      disabled={busy}
    >
      Delete
    </Button>

    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete {name ?? `item #${id}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete {name ?? `item #${id}`}? This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)} disabled={busy}>
          Cancel
        </Button>
        <fetcher.Form method="delete" action={`/menu/${id}`}>
          <Button type="submit" variant="danger" disabled={busy}>
            {busy ? "Deleting..." : "Delete"}
          </Button>
        </fetcher.Form>
      </Modal.Footer>

    </Modal>
  </>
  );
}

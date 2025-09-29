import { useFetcher, useLoaderData, useParams } from "react-router-dom";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import DeleteButton from "../parts/DeleteButton";

MenuItemEditor.route = {
  path: "/create-dish",
  menuLabel: "Add dish to menu",
  index: 4,
  requiresAdmin: true,
};

type MenuItem = {
  id: number | string;
  name: string;
  description?: string | null;
  category?: string | null;
  price_euro: number;
};

const CATEGORIES = ["Antipasti", "Pasta", "Pizza", "Dolce"] as const;

export default function MenuItemEditor() {
  const { id } = useParams<{ id: string; }>();
  const editing = Boolean(id);

  const item = editing ? (useLoaderData() as MenuItem) : null;

  const save = useFetcher();
  const saving = save.state !== "idle";
  const method = editing ? "put" : "post";
  const action = editing ? `/menu/${id}` : "/menu";

  return (
    <>
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center mb-4">
            {editing ? `Edit: ${item?.name ?? ""}` : "Add New Dish"}
          </h1>
        </Col>
      </Row>

      <save.Form key={editing ? String(id) : "new"} method={method} action={action}>
        <Row className="justify-content-center">
          <Col md={6}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Dish Name</Form.Label>
              <Form.Control
                name="name"
                placeholder="e.g. Margherita"
                defaultValue={item?.name ?? ""}
                required
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Short description…"
                defaultValue={item?.description ?? ""}
                minLength={2}
                maxLength={255}
              />
            </Form.Group>

            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category"
                defaultValue={item?.category ?? ""}
                required>
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="price_euro" className="mb-3">
              <Form.Label>Price (€)</Form.Label>
              <Form.Control
                type="number"
                inputMode="decimal"
                name="price_euro"
                min={1}
                step={0.01}
                required
                defaultValue={item?.price_euro ?? 1}
              />
            </Form.Group>

            <div className="d-flex justify-content-center gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Saving…
                  </>
                ) : (
                  "Save"
                )}
              </Button>

              {editing && item && <DeleteButton id={item.id} name={item.name} />}
            </div>
          </Col>
        </Row>
      </save.Form>
    </>
  );
}

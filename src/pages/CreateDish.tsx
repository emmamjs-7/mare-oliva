import { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";

CreateDish.route = {
  path: "/create-dish",
  menuLabel: "Add dish to menu",
  index: 4,
};

type MenuItemInput = {
  name: string;
  description: string;
  category: string;
  price_euro: number;
};

const DEFAULT_FORM: MenuItemInput = {
  name: "",
  description: "",
  category: "",
  price_euro: 0
};

export default function CreateDish() {
  const [form, setForm] = useState<MenuItemInput>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, type, value } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      if (!form.name.trim()) throw new Error("Name is required");
      if (!form.category) throw new Error("Category is required");
      if (!Number.isFinite(form.price_euro) || form.price_euro <= 0) {
        throw new Error("Price must be > 0");
      }

      const res = await fetch("/api/menu_items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          category: form.category,
          price_euro: form.price_euro,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Save failed: ${res.status} ${res.statusText} — ${text}`);
      }

      setSuccess("Dish saved ✅");
      setForm(DEFAULT_FORM);
    } catch (err: any) {
      setError(err.message ?? String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="mb-4">Add menu item</h1>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Form onSubmit={handleSubmit}>
          <Col
            md={9}>
            <Form.Group controlId="name">
              <Form.Label className="my-3">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="e.g. Margherita"
                value={form.name}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </Form.Group>
          </Col>

          <Col
            md={9}>
            <Form.Group controlId="category">
              <Form.Label className="my-3">Category</Form.Label>
              <Form.Select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Antipasti">Antipasti</option>
                <option value="Pasta">Pasta</option>
                <option value="Pizza">Pizza</option>
                <option value="Dolce">Dolce</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col
            md={9}>
            <Form.Group controlId="description">
              <Form.Label className="my-3">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Short description…"
                autoComplete="off"
                value={form.description}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={9}>
            <Form.Group controlId="price_euro">
              <Form.Label className="my-3">Price (€)</Form.Label>
              <Form.Control
                type="number"
                inputMode="decimal"
                min={1}
                step="0.10"
                name="price_euro"
                value={Number.isFinite(form.price_euro) ? form.price_euro : 0}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col xs={12}>
            <Button type="submit" className="mt-2" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </Col>
        </Form >
      </Row >

    </>
  );
}

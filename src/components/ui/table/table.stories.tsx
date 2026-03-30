import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of academic resources.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Year</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Being and Time</TableCell>
          <TableCell>Martin Heidegger</TableCell>
          <TableCell>Philosophy</TableCell>
          <TableCell className="text-right">1927</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Critique of Pure Reason</TableCell>
          <TableCell>Immanuel Kant</TableCell>
          <TableCell>Philosophy</TableCell>
          <TableCell className="text-right">1781</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">The Republic</TableCell>
          <TableCell>Plato</TableCell>
          <TableCell>Political Philosophy</TableCell>
          <TableCell className="text-right">375 BC</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Meditations</TableCell>
          <TableCell>Marcus Aurelius</TableCell>
          <TableCell>Stoicism</TableCell>
          <TableCell className="text-right">180 AD</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">
            Phenomenology of Spirit
          </TableCell>
          <TableCell>G.W.F. Hegel</TableCell>
          <TableCell>Philosophy</TableCell>
          <TableCell className="text-right">1807</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Resources</TableCell>
          <TableCell className="text-right">5</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function TeamCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Time do Léo</CardTitle>
            <Badge>Ladder</Badge>
          </div>
          <CardDescription className="text-sm">
            Data de criação: 06/04/2025
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="my-4 sm:my-6">
        <div className="flex flex-col gap-4 sm:gap-6 items-center">
          <div className="flex justify-center items-center gap-2 sm:gap-4">
            <div className="w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] border rounded-full"></div>
            <div className="w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] border rounded-full"></div>
            <div className="w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] border rounded-full"></div>
          </div>
          <span className="text-sm line-clamp-2 text-center sm:text-left">
            Descrição
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Ver Detalhes</Button>
      </CardFooter>
    </Card>
  );
}

import { getHHMM } from "../util";

test("test1", () => {
  expect(getHHMM(3665000)).toBe("01:01");
});

test("test2", () => {
  expect(getHHMM(3600000 * 100)).toBe("100:00");
});

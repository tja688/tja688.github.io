// Playwright CLI expects a function expression without a trailing semicolon.
// prettier-ignore
async (page) => {
  page.setDefaultTimeout(15000);
  let stage = "startup";
  const origin = await page.evaluate(() => location.origin);
  const errors = [];
  const failedRequests = [];
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const waitForWorks = (count) =>
    page.waitForFunction(
      (expected) =>
        document.querySelectorAll(".archive-card").length === expected,
      count,
    );
  const onError = (error) => errors.push(error.message);
  const onResponse = (response) => {
    if (response.status() >= 400 && response.url().startsWith(origin + "/"))
      failedRequests.push(`${response.status()} ${response.url()}`);
  };
  page.on("pageerror", onError);
  page.on("response", onResponse);
  try {
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(origin);
    await page.locator(".showcase-media").waitFor();
    assert(
      (await page.locator(".archive-card").count()) === 11,
      "Expected eleven works",
    );
    const pageText = await page.locator("body").innerText();
    assert(
      !/唐今|专任教师|纽卡斯尔大学|微信|315635975/.test(pageText),
      "Personal identity remains visible",
    );
    assert(
      !/The Called|地盘争夺|失控机械/.test(pageText),
      "Withheld work remains visible",
    );
    await page
      .locator(".showcase-selector")
      .getByRole("button", { name: "九宫地下城", exact: true })
      .click();
    assert(
      (await page.locator(".showcase-info h2").innerText()) === "九宫地下城",
      "Showcase selector failed",
    );
    await page
      .locator(".showcase-selector")
      .getByRole("button", { name: "Wind Will Read", exact: true })
      .click();
    assert(
      (await page.locator(".showcase-info h2").innerText()) ===
        "Wind Will Read",
      "Third showcase failed",
    );
    await page
      .locator(".showcase-selector")
      .getByRole("button", { name: "PhantomFlash", exact: true })
      .click();
    stage = "project dialogs";
    const opener = page.getByRole("button", {
      name: "打开 PhantomFlash",
      exact: true,
    });
    await opener.click();
    assert(
      page.url().endsWith("#p/phantom-flash"),
      "Project URL was not updated",
    );
    assert(
      (await page.locator("dialog[open]").count()) === 1,
      "Dialog did not open",
    );
    assert(
      (await page.locator("body").evaluate((el) => el.style.overflow)) ===
        "hidden",
      "Page scroll was not locked",
    );
    await page.keyboard.press("Tab");
    assert(
      await page.evaluate(() =>
        document.querySelector("dialog")?.contains(document.activeElement),
      ),
      "Focus escaped the dialog",
    );
    await page.keyboard.press("Escape");
    assert(
      (await page.locator("dialog[open]").count()) === 0,
      "Escape did not dismiss dialog",
    );
    assert(
      await opener.evaluate((el) => el === document.activeElement),
      "Focus was not restored",
    );
    assert(
      (await page.locator("body").evaluate((el) => el.style.overflow)) === "",
      "Page scroll remained locked",
    );
    await page.getByRole("button", { name: "练手原型" }).click();
    await waitForWorks(1);
    assert(
      (await page.locator(".archive-card").count()) === 1,
      "Prototype filter failed",
    );
    await page.getByRole("button", { name: "Game Jam" }).click();
    await waitForWorks(7);
    assert(
      (await page.locator(".archive-card").count()) === 7,
      "Jam filter failed",
    );
    await page.getByRole("button", { name: "全部作品" }).click();
    await waitForWorks(11);
    await page
      .getByRole("searchbox", { name: "搜索作品或玩法" })
      .fill("皮影");
    await waitForWorks(1);
    assert(
      (await page.locator(".archive-card").count()) === 1,
      "Search failed",
    );
    await page
      .getByRole("searchbox", { name: "搜索作品或玩法" })
      .fill("no-such-archive");
    await waitForWorks(0);
    assert(
      await page.getByRole("heading", { name: "没有找到这份档案" }).isVisible(),
      "Empty state missing",
    );
    await page.getByRole("button", { name: "重置筛选" }).click();
    await waitForWorks(11);
    assert(
      (await page.locator(".archive-card").count()) === 11,
      "Reset did not restore all works",
    );
    for (const button of await page
      .locator(".archive-card .title-button")
      .all()) {
      await button.click();
      const broken = await page
        .locator("dialog img")
        .evaluateAll((images) =>
          images
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.src),
        );
      assert(broken.length === 0, `Broken dialog images: ${broken.join(", ")}`);
      await page.getByRole("button", { name: "关闭作品详情" }).click();
    }
    stage = "motion feedback";
    // Exercise the new pointer feedback through the actual UI.
    await page.goto(origin);
    const hero = page.locator(".showcase");
    await hero.hover({ position: { x: 60, y: 50 } });
    await page.waitForFunction(() =>
      document.querySelector(".showcase").style.transform.includes("rotate"),
    );
    const mascot = page.getByRole("button", { name: "和小卡带打个招呼" });
    await mascot.click();
    assert(
      (await mascot.locator(".burst").count()) === 1,
      "Mascot click feedback missing",
    );
    stage = "reduced motion and theme";
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(origin);
    assert(
      await page
        .locator("video")
        .evaluateAll((videos) => videos.every((video) => video.paused)),
      "Reduced motion video playback",
    );
    for (const colorScheme of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.evaluate(() => {
        localStorage.removeItem("archive-theme");
        delete document.documentElement.dataset.theme;
      });
      await page.reload();
      const bg = await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor,
      );
      assert(
        bg ===
          (colorScheme === "dark" ? "rgb(21, 24, 17)" : "rgb(240, 241, 235)"),
        "System theme failed",
      );
      await page
        .getByRole("button", {
          name: colorScheme === "dark" ? "切换浅色模式" : "切换深色模式",
        })
        .click();
      await page.reload();
      assert(
        (await page.evaluate(() => document.documentElement.dataset.theme)) ===
          (colorScheme === "dark" ? "light" : "dark"),
        "Theme persistence failed",
      );
    }
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `Overflow at ${width}px`,
      );
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page
      .getByRole("button", { name: "打开 PhantomFlash", exact: true })
      .click();
    assert(
      await page
        .locator("dialog")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
      "Mobile dialog overflow",
    );
    await page.screenshot({ path: "artifacts/dialog-mobile.png" });
    await page.keyboard.press("Escape");
    await page.goto(`${origin}/#p/the-called`);
    assert(
      (await page.locator("dialog[open]").count()) === 0,
      "Withheld project URL still opens",
    );
    await page.goto(`${origin}/#p/jiugong`);
    assert(
      (await page.locator("dialog[open] h2").innerText()) === "九宫地下城",
      "Shared project URL failed",
    );
    const gameErrors = [];
    await page.keyboard.press("Escape");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(origin);
    for (const section of await page.locator("main section").all())
      await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: "artifacts/home-desktop.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: "artifacts/home-mobile.png",
      fullPage: true,
    });
    await page.goto(`${origin}/404.html`);
    assert(
      (await page.getByRole("link", { name: "返回作品库" }).count()) === 1,
      "404 recovery missing",
    );
    assert(
      errors.length + gameErrors.length === 0,
      `Runtime errors: ${[...errors, ...gameErrors].join(", ")}`,
    );
    assert(
      failedRequests.length === 0,
      `Failed requests: ${failedRequests.join(", ")}`,
    );
    return {
      passed: true,
      works: 11,
      viewports: [320, 390, 768, 1024, 1440],
      filters: "all, prototypes, jams, search, reset",
      dialogs: "11 works, escape, keyboard focus, shared URL",
      reducedMotion: "paused videos",
      theme: "system light/dark, manual toggle, persistence",
      juice: "pointer tilt, clickable mascot, animated filters",
      withheld: "The Called stays out of the catalog and shared URL",
      runtimeErrors: [],
      failedRequests: [],
      screenshots:
        "artifacts/home-desktop.png, home-mobile.png, dialog-mobile.png",
    };
  } catch (error) {
    throw new Error(`${stage}: ${error.message}`);
  } finally {
    page.off("pageerror", onError);
    page.off("response", onResponse);
  }
}

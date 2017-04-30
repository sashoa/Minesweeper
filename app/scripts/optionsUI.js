export default function() {
  let options = document.createElement('div');
  options.classList.add('options');
  options.innerHTML = `
                <h2>Game Options:</h2>
                <div class="align-left">
                <select id="difficulty" class="custom-select">
                  <option selected disabled>Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="custom">Custom</option>
                </select>
                <div class="input-group">
                  <span class="input-group-addon" id="addon1">Game Key</span>
                  <input type="text" id="seedKey" class="form-control" placeholder="string">
                </div>

                <div id="customOptions" class="custom-options hidden">
                    <h3>Custom options:</h3>
                    <small class="form-text text-muted">Min: 9, Max: 24 rows</small>
                    <div class="input-group">
                      <span class="input-group-addon" id="basic-addon1">Rows</span>
                      <input type="number" id="numberOfRows"class="form-control" placeholder="Number of Rows">
                    </div>
                    <small class="form-text text-muted">Min: 9, Max: 30 columns</small>
                    <div class="input-group">
                      <span class="input-group-addon" id="basic-addon2">Columns</span>
                      <input type="number" id="numberOfColumns" class="form-control" placeholder="Number of Columns">
                    </div>
                    <small class="form-text text-muted">Min: 10, Max: 60% of total Fields (row * col)</small>
                    <div class="input-group">
                      <span class="input-group-addon" id="basic-addon3">Mines</span>
                      <input type="number" id="numberOfMines" class="form-control" placeholder="Number of Mines">
                    </div>
                </div>
                </div>

                <div class="options-footer">
                  <button id="createGame" class="btn btn-primary">Create Game</button>
                </div>`

                return options;
} 
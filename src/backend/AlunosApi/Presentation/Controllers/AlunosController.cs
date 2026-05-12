using AlunosApi.Application.DTOs;
using AlunosApi.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlunosApi.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AlunosController : ControllerBase
{
    private readonly IAlunoService _alunoService;

    public AlunosController(IAlunoService alunoService)
    {
        _alunoService = alunoService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var alunos = await _alunoService.GetAllAsync();
        return Ok(alunos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var aluno = await _alunoService.GetByIdAsync(id);
        if (aluno == null)
            return NotFound(new { message = "Aluno não encontrado" });

        return Ok(aluno);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        var alunos = await _alunoService.SearchAsync(q ?? "");
        return Ok(alunos);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAlunoDto dto)
    {
        try
        {
            var aluno = await _alunoService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = aluno.Id }, aluno);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAlunoDto dto)
    {
        try
        {
            var aluno = await _alunoService.UpdateAsync(id, dto);
            return Ok(aluno);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _alunoService.DeleteAsync(id);
        if (!result)
            return NotFound(new { message = "Aluno não encontrado" });

        return NoContent();
    }
}